import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Add from "../Add";
import Sidebar from "../Sidebar";
import "./books.css";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/context";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/swiper-bundle.css";

// import required modules
import { Navigation } from "swiper/modules";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { FaCircleArrowRight } from "react-icons/fa6";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [currentBooks, setCurrentBooks] = useState([]);
  const [genre, setGenre] = useState("");
  const [book, setBook] = useState({
    title: "",
    description: "",
    author: "",
    genre: "",
    price: 0,
    picture: "",
  });

  const [moveBooks, setMoveBooks] = useState(0);
  const [showAddToCartButton, setShowAddToCartButton] = useState([]);

  const { cart, setCart } = useGlobalContext();

  const bookMove = useRef(null);

  const navigate = useNavigate();

  const fetchAllBooks = async () => {
    try {
      const { data } = await axios.get("https://localhost:7140/Book");
      setBooks(data);
      setCurrentBooks(data);

      //console.log(currentBooks);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  useEffect(() => {
    if (genre !== "") {
      getBooksByGenre(genre);
    }
  }, [genre]);

  const readFileDataAsBase64 = (e) => {
    const file = e.target.files[0];

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        resolve(event.target.result);
      };

      reader.onerror = (err) => {
        reject(err);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleUploadFile = (e) => {
    readFileDataAsBase64(e).then((data) => {
      setBook({ ...book, picture: data });
    });
  };

  const handleSearch = (event) => {
    const searchWord = event.target.value;

    let filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchWord.toLowerCase())
    );
    //setBooks(filteredBooks);
    setCurrentBooks(filteredBooks);
    //console.log(currentBooks);
  };

  const getBooksByGenre = (genre) => {
    if (genre.toLowerCase() === "home") {
      setCurrentBooks(books);
    } else {
      let filteredBooks = books.filter((book) => {
        return book.genre.toLowerCase() === genre.toLowerCase();
      });
      setCurrentBooks(filteredBooks);
    }
  };

  const navigateToAdd = () => {
    navigate("/add");
  };

  const addToCart = (book) => {
    if (cart === undefined) {
      console.log("Cart context is not initialized");
      return;
    }

    const foundBook = cart.find((cartItem) => book.id === cartItem.id);
    if (foundBook === undefined) {
      setCart((prevState) => {
        //const { picture, ...rest } = book;
        return [...prevState, book];
      });
    }
  };

  const handleMouseEnter = (index) => {
    setShowAddToCartButton((prevState) => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });
  };

  const handleMouseLeave = (index) => {
    setShowAddToCartButton((prevState) => {
      const newState = [...prevState];
      newState[index] = false;
      return newState;
    });
  };

  const handleMoveImagesLeft = () => {
    console.log("Uso sam");
    //arrowImagesLeft.current.classList.add("moveLeft");
    //arrowImagesLeft.current.classList.remove("moveLeft");
    let offset = bookMove.current.getBoundingClientRect();
    console.log(offset.width);
    setMoveBooks(moveBooks - offset.width);
    //const element = arrowImagesLeft.current;
    //element.style.transform = "translateX(-50px)";
  };

  const handleMoveImagesRight = () => {
    let offset = bookMove.current.getBoundingClientRect();
    setMoveBooks(moveBooks + offset.width);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
  };
  return (
    <>
      <div className="main-container">
        <Sidebar setGenre={setGenre} />
        <div className="cartIcon">
          <FaShoppingCart />
        </div>
        <div className="main">
          <h1>Zarko Shop</h1>
          <div className="search">
            <label>Search Bar</label>
            <input
              type="search"
              placeholder="Enter your search"
              name="searchValue"
              className="searchInput"
              onChange={(e) => handleSearch(e)}
            />
          </div>
          <button onClick={navigateToAdd}>Add Book</button>
          <div className="books-container">
            <div className="arrowLeft" onClick={handleMoveImagesLeft}>
              <FaCircleArrowLeft />
            </div>
            <div className="arrowRight" onClick={handleMoveImagesRight}>
              <FaCircleArrowRight />
            </div>
            <div
              className="books"
              style={{ transform: `translateX(${moveBooks}px)` }}
            >
              {currentBooks.map((book, index) => (
                <div className="book" ref={bookMove} key={book.id}>
                  <img
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                    src={book.picture}
                    alt="slika"
                  />
                  <p className="title">{book.title}</p>
                  <p className="price">{book.price} RSD</p>
                  {showAddToCartButton[index] === true && (
                    <button onClick={() => addToCart(book)}>Add to cart</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Books;
