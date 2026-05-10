const BACKEND_URL = import.meta.env.VITE_API_URL || "";

export function startKeepAlive() {
  const ping = () => {
    fetch(`${BACKEND_URL}/health`).catch(() => {});
  };
  ping();
  setInterval(ping, 14 * 60 * 1000);
}
