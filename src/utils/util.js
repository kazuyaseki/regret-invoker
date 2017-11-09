export function getTodayYYYYMMDDString() {
  let current_date = new Date();
  return (
    current_date.getFullYear() +
    ("00" + (current_date.getMonth() + 1)).slice(-2) +
    ("00" + current_date.getDate()).slice(-2)
  );
}

export function getOriginTimeDate(timeMsec){
  let date = new Date(timeMsec);
  date.setHours(0, 0, 0, 0);
  return date;
}