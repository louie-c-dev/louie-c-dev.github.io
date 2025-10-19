window.Components.DatePicker = ({ id, name, label, value, changeHandler }) => (
  <>
    <label htmlFor={name}>{label}</label>
    <input type="date" id={id} name={name} value={value} onChange={e => changeHandler(e.target.value)}></input>
  </>
)
