import { useState } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { accountingModule } from '../library/model';
import { calculateCheckout, methods, sources } from './model';
import './guide.css';

const fields = [
  { key: 'price', label: '单价（文）' },
  { key: 'quantity', label: '数量' },
  { key: 'paid', label: '实付（文）' },
] as const;
const formatMoney = new Intl.NumberFormat('zh-CN');

function CheckoutExample() {
  const [inputs, setInputs] = useState({ price: '17', quantity: '6', paid: '150' });
  const result = calculateCheckout(inputs.price, inputs.quantity, inputs.paid);
  return (
    <section className="accounting-calculator" aria-labelledby="checkout-example">
      <h3 id="checkout-example">试算找零</h3>
      <div className="accounting-inputs">
        {fields.map(({ key, label }) => (
          <label key={key}>
            {label}
            <input
              type="text"
              inputMode="numeric"
              value={inputs[key]}
              onChange={({ target }) => setInputs((previous) => ({ ...previous, [key]: target.value }))}
            />
          </label>
        ))}
      </div>
      <output className="accounting-result" aria-live="polite">
        {result ? (
          <>
            <span>应收 <strong>{formatMoney.format(result.due)} 文</strong></span>
            <span>{result.difference < 0 ? '还差' : '找零'} <strong>{formatMoney.format(Math.abs(result.difference))} 文</strong></span>
          </>
        ) : <span>金额填 0～100 万的整数，数量填 1～100 万的整数。</span>}
      </output>
    </section>
  );
}

export function AccountingGuide() {
  return (
    <article className="wrap page accounting">
      <nav className="reader-breadcrumb" aria-label="当前位置">
        <Link className="text-link" to="/?section=library"><ArrowLeft size={18} aria-hidden="true" /> 卷目</Link>
      </nav>
      <header className="guide-heading accounting-heading">
        <h1>{accountingModule.title}</h1>
        <p>在集市开个米摊：白天算买卖，打烊对账。</p>
      </header>
      <div className="accounting-methods">
        {methods.map(({ id, title, formula, method, example }) => (
          <section key={id} className="poem-notes note-block accounting-method">
            <h2>{title}</h2>
            <p className="accounting-formula">{formula}</p>
            <p>{method}</p>
            <p>{example}</p>
            {id === 'checkout' && <CheckoutExample />}
          </section>
        ))}
      </div>
      <section className="note-block sources accounting-sources">
        <h2>参考资料</h2>
        <ul>{sources.map(({ label, url }) => (
          <li key={url}><a href={url} target="_blank" rel="noreferrer">{label} <ArrowUpRight size={16} aria-hidden="true" /></a></li>
        ))}</ul>
      </section>
    </article>
  );
}
