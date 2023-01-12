import React from 'react';
import { Link, Navigate, useNavigate, useNavigation } from 'react-router-dom';
import { connect } from 'react-redux';
import { selectAuthLoading } from '../../../redux/loading.slice';
import styles from './Landing.module.sass'
import ideaLamp from '../../../assets/img/idea-lamp.png'
import notAllowed from '../../../assets/img/not-allowed.webp'
import ideaNotAllowed from '../../../assets/img/idea-not-allowed.png'

const Landing = ({ isAuthenticated }) => {
  
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <h1>Використані ідеї стартапів</h1>
      <br />
      <h2>Чому нам не потрібні оригінальні ідеї</h2>
      <p>Насправді нові ідеї - це не завжди хороше рішення для бізнесу, який ви починаєте. Стара та використана ідея це саме те що треба! Ось ряд причин:</p>
      <ol>
        <li>Компанії що взяли чужу ідею для бізнесу є найуспішнішими у світі
          <ul>
            <li>Google</li>
            <li>Facebook</li>
            <li>Spotify</li>
          </ul>
        </li>

        <li>Компанії зі свіжими бізес-ідеями є вразливими і швидко банкрутують. Вони настільки забуті, що навіть список немає сенсу зіставляти</li>

        <li>Найголовніше: не потрібно думати</li>
      </ol>
      <br />
      <img src={ideaNotAllowed} className={styles.ideaNotAllowed} alt="idea-not-allowed" />
      <h2>Насолоджуйтеся використаними ідеями з нами!</h2>
      <p>Ми пропонуємо унікальний сервіс, на якому можна вільно ділитися ідеями що вже існують. Якщо у вас є мета заснувати мільярдний стартап, просто скопіюйте його на Використаних Ідеях. Разом з нами ви можете стати МІЛЬЯРДЕРОМ, а також отримаєте шанс "вбити" Google та Amazon</p>
      <p>Наші переваги:</p>
      <ol>
        <li>Десятки постів з ідеями</li>
        <li>Реальні користувачі</li>
        <li>Можливість отримати звання</li>
        <li>Лайки</li>
        <li>Справжні 50 грн</li>
      </ol>
      <button onClick={() => navigate('/register')}>Зареєструватися</button>
      
    </div>
  );
};


const mapStateToProps = state => ({
  isAuthenticated: selectAuthLoading(state).success
});

export default connect(mapStateToProps)(Landing);
