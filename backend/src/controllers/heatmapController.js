import Event from '../models/Event.js';

export const getHeatmap = async (req, res) => {
	try {
		const { pageUrl } = req.query;

		if (!pageUrl || typeof pageUrl !== 'string') {
			return res.status(400).json({ success: false, error: 'pageUrl is required' });
		}

		const pipeline = [
			{ $match: { pageUrl, eventType: 'click', clickX: { $ne: null }, clickY: { $ne: null } } },
			{ $group: { _id: { clickX: '$clickX', clickY: '$clickY' }, count: { $sum: 1 } } },
			{ $project: { _id: 0, clickX: '$_id.clickX', clickY: '$_id.clickY', count: 1 } },
			{ $sort: { count: -1 } },
		];

		const heatmapPoints = await Event.aggregate(pipeline);
		const clickCount = heatmapPoints.reduce((sum, p) => sum + (p.count || 0), 0);

		return res.status(200).json({ pageUrl, clickCount, heatmapPoints });
	} catch (error) {
		console.error('Get Heatmap Error:', error);
		return res.status(500).json({ success: false, error: 'Failed to fetch heatmap' });
	}
};

