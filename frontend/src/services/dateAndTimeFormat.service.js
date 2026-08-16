const formateDateTime = (isoStr, output = "both") => {

  if(!isoStr){
    return "-"
  }
  const newDate = new Date(isoStr);

  const formatted = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(newDate);

  const result = {
    time: () => formatted.split(',')[1],
    date: () => formatted.split(',')[0],
    both: () => formatted,
  };

  return result[output]();
};

export default formateDateTime;
