import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { Icon } from './ui';

interface Props {
  backButton?: string | boolean;
  title: string;
  onClick?: () => void;
  closeIcon?: any;
}

const Header: FunctionComponent<Props> = ({
  backButton,
  title,
  onClick,
  closeIcon
}) => {
  const history = useHistory();

  return (
    <Wrapper>
      <BackButton>
        {typeof backButton !== 'undefined' ? (
          <Icon
            onClick={
              onClick ||
              (() =>
                history.replace(
                  typeof backButton === 'string' ? backButton : '/'
                ))
            }
            icon={closeIcon || 'return'}
            button
          />
        ) : (
          ''
        )}
      </BackButton>
      <Title>{title}</Title>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
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

export default Header;
