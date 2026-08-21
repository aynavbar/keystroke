export let sessionEndState = $state({
  endSession: false,
  showEndSessionDialog: false,
  showSessionAnalytics: false
})

export let sessionTypingState = $state({
  averageWPM: 0,
  eraseCount: 0, // each time content was removed from the textarea
  startTime: null,
  timeInMinutes: 0
})
