async function deepResolvePromises<T>(input: T | Promise<T>): Promise<T> {
  if (input instanceof Promise) {
    const resolvedInput = await input;
    return resolvedInput;
  }

  if (Array.isArray(input)) {
    const resolvedArray = await Promise.all(input.map(deepResolvePromises));
    return resolvedArray as unknown as T;
  }

  if (input instanceof Date) {
    return input;
  }

  if (typeof input === 'object' && input !== null) {
    const keys = Object.keys(input as object);
    const resolvedObject = {};

    for (const key of keys) {
      const resolvedValue = await deepResolvePromises(input[key] as T[keyof T]);
      resolvedObject[key] = resolvedValue;
    }

    return resolvedObject as T;
  }

  return input;
}

export default deepResolvePromises;
