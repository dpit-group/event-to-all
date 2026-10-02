export const formatEventDate = (date: Date | string | undefined) => {
    const parsedDate = date instanceof Date ? date : new Date(date ?? "");

    if (!date || Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    const formattedDate = parsedDate.toLocaleDateString("en-GB");
    const formattedTime = parsedDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });

    return `${formattedDate} at ${formattedTime}`;
  };