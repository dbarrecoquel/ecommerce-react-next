"use client";

import {useState} from "react";
import styles from "./quantity.module.css";

interface QuantityInputProps {
    min? : number;
    max? : number;
    initial? : number;
    onChange? : (qty : number) => void;
}

export default function QuantityInput({
    min = 1,
    max = 99,
    initial = 1,
    onChange,
}: QuantityInputProps){
    const [qty, setQty] = useState(initial);

    const update = (next : number) => {
        const clamped = Math.min(Math.max(next, min), max);
        setQty(clamped);
        onChange?.(clamped);
    }

    const handleInput = (e : React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val)) update(val); 
    }
      return (
        <div className={styles.wrapper}>
        <button
            type="button"
            className={styles.btn}
            onClick={() => update(qty - 1)}
            disabled={qty <= min}
            aria-label="Diminuer la quantité"
        >
            −
        </button>
        <input
            type="number"
            className={styles.input}
            value={qty}
            min={min}
            max={max}
            onChange={handleInput}
            aria-label="Quantité"
        />
        <button
            type="button"
            className={styles.btn}
            onClick={() => update(qty + 1)}
            disabled={qty >= max}
            aria-label="Augmenter la quantité"
        >
            +
        </button>
        </div>
    );

}