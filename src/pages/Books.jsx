import React, { useState, useEffect } from "react";
import axios from "axios";
import Add from "./Add";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

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

  return (
    <>
      <div className="main-container">
        <Sidebar setGenre={setGenre} />
        <div className="main">
          <h1>Zarko Shop</h1>
          <label>Search Bar</label>
          <input
            type="search"
            placeholder="Enter your search"
            name="searchValue"
            className="searchInput"
            onChange={(e) => handleSearch(e)}
          />
          <button onClick={navigateToAdd}>Add Book</button>
          <div className="books">
            {currentBooks.map((book) => {
              return (
                <div className="book" key={book.id}>
                  <div className="book-details">
                    <img src={book.picture} alt="slika" />
                    <h2>{book.title}</h2>
                    <p>{book.description}</p>
                    <p>{book.author}</p>
                    <p>{book.genre}</p>
                    <p>{book.price}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Books;
