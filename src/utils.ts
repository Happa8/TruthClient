const oneSecond = 1000;
const oneMinute = 60 * oneSecond;
const oneHour = 60 * oneMinute;
const oneDay = 24 * oneHour;
const oneWeek = 7 * oneDay;

export const calcTimeDelta = (time: Date): string => {
  const now = new Date();
  const timeDelta = now.getTime() - time.getTime();

  if (timeDelta > 4 * oneWeek) {
    return time.toLocaleString("en", { month: "short", day: "2-digit" });
  } else if (timeDelta > oneWeek) {
    return `${Math.floor(timeDelta / oneWeek)}w`;
  } else if (timeDelta > oneDay) {
    return `${Math.floor(timeDelta / oneDay)}d`;
  } else if (timeDelta > oneHour) {
    return `${Math.floor(timeDelta / oneHour)}h`;
  } else if (timeDelta > oneMinute) {
    return `${Math.floor(timeDelta / oneMinute)}m`;
  } else if (timeDelta > oneSecond) {
    return `${Math.floor(timeDelta / oneSecond)}s`;
  } else {
    return "now";
  }
};

export const checkQuote = (input: string): { id: string } | undefined => {
  const matchPattern = new RegExp(
    `<span class=\\"quote-inline\\"><br/>RT: (.*?)</span>`
  );
  const matchArray = input.match(matchPattern);
  if (matchArray === null) {
    return undefined;
  }
  const params = matchArray[1].slice(8).split("/");
  return {
    id: params[4],
  };
};

export const getContentFromPost = (input: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, "text/html");
  const spansToRemove = doc.querySelectorAll("span.quote-inline");
  spansToRemove.forEach((span) => {
    span.remove();
  });

  return doc.body.innerHTML;
};
