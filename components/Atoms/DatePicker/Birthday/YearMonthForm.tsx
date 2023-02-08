import React from "react";
const currentYear = new Date().getFullYear();
const fromMonth = new Date(currentYear - 70, 0);
const toMonth = new Date(currentYear + 0, 11);

const YearMonthForm = ({ date, localeUtils, onChange }: any) => {
  const months = localeUtils.getMonths();

  const years = [];
  for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
    years.push(i);
  }
  years.sort((a, b) => b - a);
  const handleChange = function handleChange(e: any) {
    const { year, month } = e.target.form;
    onChange(new Date(year.value, month.value));
  };

  return (
    <div className="DayPicker-Caption">
      <select name="month" onChange={handleChange} value={date.getMonth()}>
        {months.map((month: any, i: any) => (
          <option key={month} value={i}>
            {month}
          </option>
        ))}
      </select>
      <select name="year" onChange={handleChange} value={date.getFullYear()}>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearMonthForm;
