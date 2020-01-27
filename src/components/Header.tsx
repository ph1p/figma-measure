import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

interface Props {
  backButton?: boolean;
  title: string;
}

const Wrapper = styled.div`
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  height: 33px;
  align-items: center;
`;

const Title = styled.div`
  font-weight: bold;
`;

const BackButton = styled.div`
  margin-right: 10px;
  border-right: 1px solid #e5e5e5;
  cursor: pointer;
  .icon {
    cursor: pointer;
  }
`;

const Header: FunctionComponent<Props> = ({ backButton = false, title }) => {
  const history = useHistory();

  return (
    <Wrapper>
      <BackButton>
        {backButton ? (
          <div
            onClick={() => history.replace('/')}
            className="icon icon--return icon--button"
          ></div>
        ) : (
          ''
        )}
      </BackButton>
      <Title>{title}</Title>
    </Wrapper>
  );
};

export default Header;
