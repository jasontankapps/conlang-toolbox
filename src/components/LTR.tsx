const ltr = (element = document.body) => window.getComputedStyle(element).direction === "ltr";

export default ltr;
