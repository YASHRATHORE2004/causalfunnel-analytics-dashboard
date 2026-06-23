import Event from '../models/Event.js';

export const getStats = async (req, res) => {
	try {
		const agg = await Event.aggregate([
			{
				$facet: {
					totalEvents: [{ $count: 'count' }],
					totalSessions: [
						{ $group: { _id: '$sessionId' } },
						{ $count: 'count' },
					],
					totalPageViews: [
						{ $match: { eventType: 'page_view' } },
						{ $count: 'count' },
					],
					totalClicks: [
						{ $match: { eventType: 'click' } },
						{ $count: 'count' },
					],
					topPages: [
						{
							$group: {
								_id: '$pageUrl',
								pageViewCount: {
									$sum: { $cond: [{ $eq: ['$eventType', 'page_view'] }, 1, 0] },
								},
								clickCount: {
									$sum: { $cond: [{ $eq: ['$eventType', 'click'] }, 1, 0] },
								},
							},
						},
						{ $project: { _id: 0, pageUrl: '$_id', pageViewCount: 1, clickCount: 1 } },
						{ $sort: { pageViewCount: -1, clickCount: -1 } },
						{ $limit: 10 },
					],
				},
			},
		]);

		const data = agg[0] || {};

		const totalEvents = data.totalEvents?.[0]?.count || 0;
		const totalSessions = data.totalSessions?.[0]?.count || 0;
		const totalPageViews = data.totalPageViews?.[0]?.count || 0;
		const totalClicks = data.totalClicks?.[0]?.count || 0;
		const topPages = data.topPages || [];

		return res.status(200).json({
			totalEvents,
			totalSessions,
			totalPageViews,
			totalClicks,
			topPages,
		});
	} catch (error) {
		console.error('Get Stats Error:', error);
		return res.status(500).json({ success: false, error: 'Failed to fetch stats' });
	}
};


