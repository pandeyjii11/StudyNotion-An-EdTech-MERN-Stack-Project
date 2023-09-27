export const formattedDate = (date) => {
    return new Date(date).toLocalDateString("en-US",  {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
} 