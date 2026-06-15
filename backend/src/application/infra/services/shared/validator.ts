export interface Validator<T> {
  validate(input: T): Promise<T>
}
