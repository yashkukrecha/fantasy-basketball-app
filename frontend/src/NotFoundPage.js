import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const NotFoundPage = (props) => {
  return (
    <div>
      <h1> 404 Not Found </h1>
      <Link to="/"> Click here to go back home </Link>
    </div>
  );
};

export default NotFoundPage;
