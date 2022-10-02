import React from "react";

function Login({ handleLogin }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handleChange(evt) {
    if (evt.target.name === "Email") {
      setEmail(evt.target.value);
    } else if (evt.target.name === "Password") {
      setPassword(evt.target.value);
    }
  }

  function resetForm() {
    setEmail("");
    setPassword("");
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    if (!email) {
      console.log("Не введен email");
      return;
    }
    if (!password) {
      console.log("Не введен пароль");
      return;
    }
    handleLogin(email, password);
    resetForm();
  }

  return (
    <section className="sign">
      <h2 className="sign__title">Вход</h2>
      <form
        className="sign__form"
        action="#"
        name="sign-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <input
          className="sign__input"
          placeholder="Email"
          name="Email"
          type="email"
          value={email}
          onChange={handleChange}
          required
        ></input>
        <input
          className="sign__input"
          placeholder="Пароль"
          name="Password"
          type="password"
          value={password}
          onChange={handleChange}
          required
        ></input>
        <button className="sign__button" type="submit">
          Войти
        </button>
      </form>
    </section>
  );
}

export default Login;