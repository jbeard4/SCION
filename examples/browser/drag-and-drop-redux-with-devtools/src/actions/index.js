export const mouseevent = (event) => ({
  type: event.type,
  data: {
    screenX : event.screenX,
    screenY : event.screenY
  }
})
