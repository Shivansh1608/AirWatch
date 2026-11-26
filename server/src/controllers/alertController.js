// In-memory alert store
const memoryAlerts = new Map();

export function getAlerts(req, res) {
  const userId = req.user?.id || 'demo_user';
  const alerts = memoryAlerts.get(userId) || [
    {
      id: 'alt_1',
      cityName: 'Delhi',
      slug: 'delhi',
      threshold: 200,
      active: true,
      lastTriggeredAt: new Date(Date.now() - 3600000).toISOString()
    }
  ];

  return res.json({ success: true, data: alerts });
}

export function createAlert(req, res) {
  const userId = req.user?.id || 'demo_user';
  const { cityName, slug, threshold } = req.body;

  if (!cityName || !threshold) {
    return res.status(400).json({ success: false, error: { message: 'City name and threshold are required' } });
  }

  const alerts = memoryAlerts.get(userId) || [];
  const newAlert = {
    id: 'alt_' + Date.now(),
    cityName,
    slug: slug || cityName.toLowerCase().replace(/\s+/g, '-'),
    threshold: Number(threshold),
    active: true,
    lastTriggeredAt: null
  };

  alerts.push(newAlert);
  memoryAlerts.set(userId, alerts);

  return res.status(201).json({ success: true, data: newAlert });
}

export function toggleAlert(req, res) {
  const userId = req.user?.id || 'demo_user';
  const { id } = req.params;
  const { active, threshold } = req.body;

  const alerts = memoryAlerts.get(userId) || [];
  const item = alerts.find((a) => a.id === id);
  if (!item) {
    return res.status(404).json({ success: false, error: { message: 'Alert not found' } });
  }

  if (typeof active === 'boolean') item.active = active;
  if (threshold) item.threshold = Number(threshold);

  return res.json({ success: true, data: item });
}

export function deleteAlert(req, res) {
  const userId = req.user?.id || 'demo_user';
  const { id } = req.params;

  let alerts = memoryAlerts.get(userId) || [];
  alerts = alerts.filter((a) => a.id !== id);
  memoryAlerts.set(userId, alerts);

  return res.json({ success: true, message: 'Alert deleted successfully' });
}
