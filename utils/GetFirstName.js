export default GetFirstName = (name) => {
  if (name == undefined) {
    return "Someone";
  } else {
    return name?.split(" ")[0];
  }
};
