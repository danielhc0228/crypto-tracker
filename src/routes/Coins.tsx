import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchCoins } from "../api";
import { Helmet } from "react-helmet";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atom";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
  background-color: ${(props) => props.theme.panelColor};
  color: ${(props) => props.theme.textColor};
  border-radius: 15px;
  margin-bottom: 10px;
  a {
    display: flex;
    align-items: center;
    padding: 20px;
    transition: color 0.2s ease-in;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Img = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 10px;
`;


const Toggle = styled.button`
    position: absolute;
    left: 60%;
    color: ${(props) => props.theme.accentColor};
    background: #5E5DF0;
    border-radius: 999px;
    box-shadow: #5E5DF0 0 10px 20px -10px;
    box-sizing: border-box;
    color: #FFFFFF;
    cursor: pointer;
    font-size: 25px;
    font-weight: 500;
    opacity: 1;
    outline: 0 solid transparent;
    padding: 2px 20px;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    width: fit-content;
    word-break: break-word;
    border: 0;
`

interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

function Coins() {
  const isDark = useRecoilValue(isDarkAtom);
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom(prev => !prev);
  const { isLoading, data } = useQuery<ICoin[]>("allCoins", fetchCoins);
    return <Container>
              <Helmet>
                <title>Coins</title>
              </Helmet>
              <Header>
                <Title>Coins</Title>
                <Toggle onClick={toggleDarkAtom}>{isDark ? "☾" : "☀︎"}</Toggle>
              </Header>
              {isLoading ? <Loader>Loading...</Loader> : 
              <CoinsList>
                {data?.slice(0, 100).map((coin) => (
                  <Coin>
                    <Link
                to={{
                  pathname: `/${coin.id}`,
                  state: { name: coin.name },
                }}
              >
                    <Img src={`https://raw.githubusercontent.com/jsupa/crypto-icons/main/icons/${coin.symbol.toLowerCase()}.png`}
                />{coin.name}</Link>
                  </Coin>
                ))}
                
              </CoinsList>
              }
            </Container>
   
  }
export default Coins;