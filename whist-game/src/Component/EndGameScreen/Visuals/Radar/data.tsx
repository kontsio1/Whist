export type Variable = "accuracy" | "precision" | "recall"

type DataItem<T extends string> = {
    [key in T]: number
} & {
    name: string
}

export type Data = DataItem<Variable>[]

export const data: Data = [
    { accuracy: 5.1, precision: 9.5, recall: 1.4, name: "calling 1" },
    { accuracy: 4.9, precision: 3.0, recall: 9.4, name: "calling 2" },
    { accuracy: 2.7, precision: 1.2, recall: 1.3, name: "calling 3" },
]