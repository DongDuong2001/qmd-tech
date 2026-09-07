import { getServiceSupabase } from "@/shared/db/supabase";

export interface ReviewItem {
  id: string;
  product_id: string;
  user_id?: string | null;
  author_name: string;
  rating: number;
  title?: string;
  comment: string;
  locale: string;
  is_verified_purchase: boolean;
  created_at: string;
}

export class ReviewService {
  async getProductReviews(productId: string): Promise<ReviewItem[]> {
    try {
      const db = getServiceSupabase();
      const { data, error } = await db
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as ReviewItem[];
      }
    } catch (err) {
      console.error("ReviewService.getProductReviews error:", err);
    }

    if (process.env.NODE_ENV === "production") {
      return [];
    }

    return [
      {
        id: "rev-1",
        product_id: productId,
        author_name: "Nguyễn Văn Hùng",
        rating: 5,
        title: "Hiệu năng cực đỉnh",
        comment: "Sản phẩm chính hãng nguyên seal, đóng gói cẩn thận 3 lớp xốp khí. Chạy mát và rất ổn định!",
        locale: "vi",
        is_verified_purchase: true,
        created_at: new Date().toISOString(),
      },
    ];
  }

  async createReview(review: Omit<ReviewItem, "id" | "created_at">): Promise<ReviewItem | null> {
    try {
      const db = getServiceSupabase();
      const rating = Math.min(5, Math.max(1, Math.round(Number(review.rating) || 5)));
      let isVerified = false;

      // Authoritatively verify purchase from database if user_id is provided
      if (review.user_id) {
        const { data: paidOrders } = await db
          .from("orders")
          .select("id")
          .eq("user_id", review.user_id)
          .eq("payment_status", "paid");

        if (paidOrders && paidOrders.length > 0) {
          const orderIds = paidOrders.map((o) => o.id);
          const { data: matchItem } = await db
            .from("order_items")
            .select("id")
            .in("order_id", orderIds)
            .eq("product_id", review.product_id)
            .limit(1);

          if (matchItem && matchItem.length > 0) {
            isVerified = true;
          }
        }
      }

      const reviewId = crypto.randomUUID();
      const { data, error } = await db
        .from("reviews")
        .insert({
          id: reviewId,
          product_id: review.product_id,
          user_id: review.user_id || null,
          author_name: review.author_name.trim().slice(0, 100),
          rating,
          title: review.title ? review.title.trim().slice(0, 150) : null,
          comment: review.comment.trim().slice(0, 2000),
          locale: review.locale || "vi",
          is_verified_purchase: isVerified,
        })
        .select()
        .single();

      if (!error && data) {
        return data as ReviewItem;
      }
      if (error) {
        console.error("ReviewService.createReview db error:", error);
      }
    } catch (err) {
      console.error("ReviewService.createReview exception:", err);
    }
    return null;
  }
}

export const reviewService = new ReviewService();

