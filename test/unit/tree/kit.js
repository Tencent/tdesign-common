export const wait = (time) => new Promise((resolve) => {
  setTimeout(resolve, time);
});

const kit = {
  wait,
};

export default kit;
