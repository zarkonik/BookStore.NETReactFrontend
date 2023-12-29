import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [book, setBook] = useState({
    title: "",
    description: "",
    author: "",
    genre: "",
    price: 0,
    picture: "",
    //imagename: "",
    //imagebytes: null,
  });

  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(book);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const newBook = { ...book, price: parseInt(book.price) };
      console.log(newBook);
      const { data } = await axios.post("https://localhost:7140/Book", newBook);
      console.log(data);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="form">
      <h1>Add new Book</h1>
      <input
        type="text"
        placeholder="title"
        onChange={handleChange}
        name="title"
      />
      <input
        type="text"
        placeholder="description"
        onChange={handleChange}
        name="description"
      />
      <input
        type="text"
        placeholder="author"
        onChange={handleChange}
        name="author"
      />
      <input
        type="text"
        placeholder="genre"
        onChange={handleChange}
        name="genre"
      />
      <input
        type="number"
        placeholder="price"
        onChange={handleChange}
        name="price"
      />
      <input type="file" onChange={(e) => handleUploadFile(e)} />

      <button className="formButton" onClick={(e) => handleClick(e)}>
        Add
      </button>
    </div>
  );
};

export default Add;
