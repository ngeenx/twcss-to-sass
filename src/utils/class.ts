const ClassUtils = {
  /**
   * Order by class names
   *
   * @param classes string
   * @returns string
   */
  orderClasses(classes: string): string {
    const classList = classes.split(/\s+/g)

    const orderedClassList = classList
      .sort((a, b) => {
        return a > b ? 1 : a < b ? -1 : 0
      })
      .join(' ')

    return orderedClassList
  },
}

export default ClassUtils
