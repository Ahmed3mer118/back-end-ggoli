const Order = require("../models/order.model");

exports.getSalesReports = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const matchStage = {};

        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        const report = await Order.aggregate([
            { $match: matchStage },

            // فك المنتجات من المصفوفة
            { $unwind: "$products" },

            // ربط المستخدم
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },

            // ربط المنتج
            {
                $lookup: {
                    from: "products",
                    localField: "products.productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },

            // إضافة إجمالي سعر كل منتج في الأوردر
            {
                $addFields: {
                    totalPrice: { $multiply: ["$products.price", "$products.quantity"] },
                    quantity: "$products.quantity"
                }
            },

            {
                $facet: {
                    // إجمالي الإحصائيات
                    overAllStatus: [
                        {
                            $group: {
                                _id: null,
                                totalSaleAmount: { $sum: "$totalPrice" },
                                totalQuantitySold: { $sum: "$quantity" },
                                numberOfPurchases: { $sum: 1 }
                            }
                        }
                    ],

                    // أفضل 5 منتجات
                    topProducts: [
                        {
                            $group: {
                                _id: "$product._id",
                                name: { $first: "$product.product_title" },
                                revenue: { $sum: "$totalPrice" },
                                soldQuantity: { $sum: "$quantity" }
                            }
                        },
                        { $sort: { revenue: -1 } },
                        { $limit: 5 }
                    ],

                    // أفضل 5 عملاء
                    topClients: [
                        {
                            $group: {
                                _id: "$user._id",
                                username: { $first: "$user.username" },
                                email: { $first: "$user.email" },
                                totalSpent: { $sum: "$totalPrice" },
                                totalQuantity: { $sum: "$quantity" }
                            }
                        },
                        { $sort: { totalSpent: -1 } },
                        { $limit: 5 }
                    ],

                    // المبيعات الشهرية
                    monthSales: [
                        {
                            $group: {
                                _id: {
                                    year: { $year: "$createdAt" },
                                    month: { $month: "$createdAt" }
                                },
                                totalRevenue: { $sum: "$totalPrice" },
                                totalQuantity: { $sum: "$quantity" }
                            }
                        },
                        { $sort: { "_id.year": 1, "_id.month": 1 } }
                    ]
                }
            }
        ]);

        res.status(200).json({ message: "Report generated successfully", report });
    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ error: "Server error while generating report" });
    }
};
