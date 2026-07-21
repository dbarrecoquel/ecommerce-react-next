import { Address } from "@/models/address.model";
import styles from "./address-selector.module.css";

interface AddressSelectorProps {
  title: string;
  addresses: Address[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAddNew: () => void;
}

const TYPE_LABEL: Record<string, string> = { SHIPPING: "Livraison", BILLING: "Facturation" };

export default function AddressSelector({
  title, addresses, selectedId, onSelect, onAddNew,
}: AddressSelectorProps) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <button type="button" className={styles.addBtn} onClick={onAddNew}>
          + Nouvelle adresse
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className={styles.empty}>
          <span>📍</span>
          <p>Aucune adresse enregistrée.</p>
          <button type="button" className={styles.addBtnLarge} onClick={onAddNew}>
            Ajouter une adresse
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {addresses.map((addr) => (
            <button
              type="button"
              key={addr.id}
              onClick={() => onSelect(addr.id)}
              className={`${styles.card} ${selectedId === addr.id ? styles.selected : ""}`}
            >
              <div className={styles.cardTop}>
                <span className={styles.label}>{addr.label}</span>
                <span className={`${styles.badge} ${styles[addr.addressType.toLowerCase()]}`}>
                  {TYPE_LABEL[addr.addressType]}
                </span>
                {addr.isDefault && <span className={styles.defaultBadge}>Par défaut</span>}
              </div>
              <div className={styles.cardBody}>
                <p>{addr.street}</p>
                {addr.complement && <p className={styles.complement}>{addr.complement}</p>}
                <p>{addr.postalCode} {addr.city}</p>
                <p>{addr.country}</p>
              </div>
              {selectedId === addr.id && (
                <span className={styles.checkmark}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}