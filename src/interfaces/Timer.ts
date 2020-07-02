export type Counter = string|number;

export default interface Timer {
    setInterval(callback: Function, delay: number): Counter;
    clearInterval(counter: Counter): void;
}