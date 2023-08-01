const WeekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const GetReqFormat = (sevenDaysTxns) => {
  const day0 = new Date();
  const day1 = new Date();
  day1.setDate(new Date().getDate() - 1);
  const day2 = new Date();
  day2.setDate(new Date().getDate() - 2);
  const day3 = new Date();
  day3.setDate(new Date().getDate() - 3);
  const day4 = new Date();
  day4.setDate(new Date().getDate() - 4);
  const day5 = new Date();
  day5.setDate(new Date().getDate() - 5);
  const day6 = new Date();
  day6.setDate(new Date().getDate() - 6);

  let sevenWeeksData = [
    { day: WeekDays[day6.getDay()], debit: 0, credit: 0 },
    { day: WeekDays[day5.getDay()], debit: 0, credit: 0 },
    { day: WeekDays[day4.getDay()], debit: 0, credit: 0 },
    { day: WeekDays[day3.getDay()], debit: 0, credit: 0 },
    { day: WeekDays[day2.getDay()], debit: 0, credit: 0 },
    { day: WeekDays[day1.getDay()], debit: 0, credit: 0 },
    { day: WeekDays[day0.getDay()], debit: 0, credit: 0 },
  ];

  const GivenData = sevenDaysTxns;

  for (let item of GivenData) {
    const { date, sum, type } = item;

    const dateOfTxn = new Date(date);

    const dayOfTxn = WeekDays[dateOfTxn.getDay()];

    const modified = sevenWeeksData.map((each) => {
      if (dayOfTxn === each.day) {
        each[type] += sum;

        return each;
      }
      return each;
    });
    sevenWeeksData = modified;
  }
  return sevenWeeksData;
};

export default GetReqFormat;
