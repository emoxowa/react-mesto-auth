
import React, { useState, useEffect } from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import { api } from "../utils/Api";
import CurrentUserContext from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import DeleteCardPopup from "./DeleteCardPopup";

function App() {
  const [isEditAvatarPopupOpen, setIsPopupAvatarOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsPopupProfileOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsPopupAddPlaceOpen] = useState(false);
  const [isImagePopupOpen, setImagePopupOpen] = useState(false);
  const [isDeleteCardPopupOpen, setDeleteCardPopupOpen] = useState(false);

  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [cardDelete, setCardDelete] = useState({});

    useEffect(() => {
      api
        .getInitialCardsFromServer()
        .then((dataCards) => {
          setCards(dataCards);
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);
  
    useEffect(() => {
      api
        .getUserInfoFromServer()
        .then((res) => {
          setCurrentUser(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);

  function handleEditAvatarClick() {
    setIsPopupAvatarOpen(true);
  }

  function handleEditProfileClick() {
    setIsPopupProfileOpen(true);
  }

  function handleAddPlaceClick() {
    setIsPopupAddPlaceOpen(true);
  }

  function handleDeleteCardClick(card) {
    setDeleteCardPopupOpen(true);
    setCardDelete(card);
  }

  function closeAllPopups() {
    setIsPopupAvatarOpen(false);
    setIsPopupProfileOpen(false);
    setIsPopupAddPlaceOpen(false);
    setImagePopupOpen(false);
    setSelectedCard(false);
    setDeleteCardPopupOpen(false);
  }

  const handleCardClick = (card) => {
    setImagePopupOpen(true);
    setSelectedCard(card);
  };

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeStatus(isLiked, card._id)
      .then((newCard) => {
      setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
    })
      .catch((err) => { console.log(err) })
  } 

  function handleCardDelete(card) {
    api
      .deleteCardFromServer(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups();
    })
      .catch((err) => { console.log(err) })
  }

  function handleUpdateUser({ name, job }) {
    api
      .setUserInfoFromServer({ name, job })
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar({ avatar }) {
     api
       .changeUserAvatar({ avatar })
       .then((res) => {
         setCurrentUser(res);
         closeAllPopups();
       })
       .catch((err) => console.log(err));
   }

    function handleAddPlaceSubmit({ name, link }) {
      api
        .setCardToServer({ name, link })
        .then((newCard) => {
          setCards([newCard, ...cards]);
          closeAllPopups();
        })
        .catch((err) => console.log(err));
    }
  
  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header />
        <Main
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          onCardDelete={handleDeleteCardClick}
          cards={cards}
        />
        <Footer />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <DeleteCardPopup
          isOpen={isDeleteCardPopupOpen}
          onClose={closeAllPopups}
          onCardDelete={handleCardDelete}
          card={cardDelete}
        />

        <ImagePopup
          card={selectedCard}
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
