import { useEffect, useState } from "react";
import { useOffline } from "../../hooks/useOffline.js";

const InstallBanner = () => {
  const [promptEvent, setPromptEvent] = useState(null);
  const { isOnline } = useOffline();

  useEffect(() => {
    const handler = (event) => {
      event.preventDefault();
      setPromptEvent(event);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!promptEvent) return;
    promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
  };

  return (
    <div className="fixed right-3 top-3 z-50 flex flex-col gap-2">
      {!isOnline && (
        <div className="rounded-lg border-2 border-brand-bean bg-[#f3e8da] px-3 py-2 text-xs text-brand-bean">
          Offline mode
        </div>
      )}
      {promptEvent && (
        <button type="button" onClick={install} className="cute-btn px-3 py-2 text-xs">
          Установить приложение
        </button>
      )}
    </div>
  );
};

export default InstallBanner;

