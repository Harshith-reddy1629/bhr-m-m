const Months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DateConverter = (dategiven) => {
  const d = new Date(dategiven);

  const date = d.getDate();
  const month = Months[d.getMonth()];

  const hr = d.getHours();

  const mins = d.getMinutes();

  const ampm = hr > 12 ? "PM" : "AM";

  return `${date} ${month}, ${hr % 12}:${mins} ${ampm}`;
};

export default DateConverter;
