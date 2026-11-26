const memoryNotifications = [
  {
    id: 'notif_1',
    cityName: 'Delhi',
    message: 'AQI Alert: Delhi crossed threshold 200 (Current CPCB AQI: 312 - Very Poor). Limit outdoor activities.',
    aqi: 312,
    category: 'Very Poor',
    read: false,
    createdAt: new Date(Date.now() - 45 * 60000).toISOString()
  }
];

export function getNotifications(req, res) {
  return res.json({
    success: true,
    data: memoryNotifications
  });
}

export function markAsRead(req, res) {
  const { id } = req.params;
  const item = memoryNotifications.find((n) => n.id === id);
  if (item) {
    item.read = true;
  }
  return res.json({
    success: true,
    message: 'Notification marked as read'
  });
}
