export const MarkHotKey = (options) => {
	const {type, code, isAltKey = false} = options;
	return {
		onKeyDown(event, data, state) {
      // Check that the key pressed matches our `code` option.
      if (!event.metaKey || event.which != code || event.altKey != isAltKey) return

      // Prevent the default characters from being inserted.
      event.preventDefault()

      // Toggle the mark `type`.
      return state
        .transform()
        .toggleMark(type)
        .apply()
    }
	}
}