import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LanguageContext, LanguageContextType } from "../core/LanguageProvider";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useConnect } from "wagmi";

const Header: React.FC = () => {
  const ctx = useContext<LanguageContextType>(LanguageContext);
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();

  return (
    <header id="header">
      <nav className="navbar navbar-expand navbar-fixed-top">
        <div className="container header">
          {/* Logo */}
          <Link className="navbar-brand" to="/">
            <img
              src="../../../assets/images/perezoso.png"
              className="img-fluid"
              alt="Perezoso"
            />
          </Link>

          <div className="ml-auto"></div>

          <ul className="navbar-nav items mx-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                {!ctx.isSpanishCountry ? "Home" : "Hogar"}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/raffle">
                {!ctx.isSpanishCountry ? "Raffle Draw" : "Sorteo"}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/leaderboard">
                {!ctx.isSpanishCountry ? "Leaderboard" : "líder"}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">
                {!ctx.isSpanishCountry ? "Buy Token" : "Comprar Ficha"}
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav action">
            <li className="nav-item ml-2">
              <a
                className="btn ml-lg-auto btn-bordered-white"
                onClick={() => open()}
              >
                <i className="fa-solid fa-wallet mr-md-2"></i>
                {isConnected
                  ? `${address?.slice(0, 6)}...${address?.slice(-6)}`
                  : !ctx.isSpanishCountry
                  ? "Wallet Connect"
                  : "Conectar billetera"}
              </a>
            </li>
          </ul>
          <ul className="navbar-nav toggle">
            <li className="nav-item">
              <a
                className="nav-link"
                data-bs-toggle="modal"
                data-bs-target="#menu"
              >
                <i className="fa-solid fa-bars m-0"></i>
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div id="menu" className="modal fade p-0">
        <div className="modal-dialog dialog-animated">
          <div className="modal-content h-100">
            <div
              className="modal-header"
              data-bs-dismiss="modal"
              style={{ color: "#fff" }}
            >
              Menu <i className="far fa-times-circle icon-close"></i>
            </div>
            <div className="menu modal-body">
              <div className="row w-100">
                <div className="items p-0 col-12 text-center">
                  <ul className="navbar-nav items mx-auto">
                    <li
                      className="nav-item"
                      data-bs-dismiss="modal"
                      style={{ fontSize: "20px" }}
                    >
                      <Link className="nav-link" to="/">
                        {!ctx.isSpanishCountry ? "Home" : "Hogar"}
                      </Link>
                    </li>
                    <li
                      className="nav-item"
                      data-bs-dismiss="modal"
                      style={{ fontSize: "20px" }}
                    >
                      <Link className="nav-link" to="/raffle">
                        {!ctx.isSpanishCountry ? "Raffle Draw" : "Sorteo"}
                      </Link>
                    </li>
                    <li
                      className="nav-item"
                      data-bs-dismiss="modal"
                      style={{ fontSize: "20px" }}
                    >
                      <Link className="nav-link" to="/leaderboard">
                        {!ctx.isSpanishCountry ? "Leaderboard" : "líder"}
                      </Link>
                    </li>
                    <li
                      className="nav-item"
                      data-bs-dismiss="modal"
                      style={{ fontSize: "20px" }}
                    >
                      <Link className="nav-link" to="/">
                        {!ctx.isSpanishCountry ? "Buy Token" : "Comprar Ficha"}
                      </Link>
                    </li>
                    <li
                      className="nav-item"
                      data-bs-dismiss="modal"
                      style={{ fontSize: "20px" }}
                    >
                      <a
                        className="btn ml-lg-auto btn-bordered-white"
                        onClick={() => open}
                      >
                        <i className="fa-solid fa-wallet mr-md-2"></i>
                        {isConnected
                          ? `${address?.slice(0, 6)}...${address?.slice(-6)}`
                          : !ctx.isSpanishCountry
                          ? "Wallet Connect"
                          : "Conectar billetera"}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
