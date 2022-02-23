import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { DetachmentImage } from './components/DetachmentImage';
import { FillsImage } from './components/FillsImage';
import { LinesImage } from './components/LinesImage';
import { PaddingImage } from './components/PaddingImage';
import { SpacingImage } from './components/SpacingImage';
import { TooltipsImage } from './components/TooltipsImage';

const Home: FunctionComponent = observer(() => {
  return (
    <Container>
      <Paragraph>
        <h3>Hello there!</h3>
        <p>
          Thank you for using Figma Measure! Feel always free to let us know
          about bugs, ideas or what we should consider to change to improve the
          workflow, any feedback is welcome.
          <br />
          <br />
          And if we didn't mention it yet, Figma Measure will be{' '}
          <strong>free and open-source forever</strong>.
          <br />
          <br />
          Happy measuring
        </p>
        <Users>
          <User href="https://twitter.com/phlp_" target="_blank">
            <img src="https://pbs.twimg.com/profile_images/1166697449089576962/RuaH73w-_400x400.jpg" />
            <span>@phlp_</span>
          </User>
          <User href="https://twitter.com/crlhsr" target="_blank">
            <img src="https://pbs.twimg.com/profile_images/1472570965880377345/bH7sWPxq_400x400.jpg" />
            <span>@crlhsr</span>
          </User>
        </Users>
      </Paragraph>

      <GuidesHeadline>
        <h3>Guides</h3>
        <a
          href="https://github.com/ph1p/figma-measure/discussions"
          target="_blank"
        >
          discussions {'->'}
        </a>
      </GuidesHeadline>

      <Cards>
        <Card
          className="line"
          title="How lines work"
          link="https://github.com/ph1p/figma-measure/blob/master/docs/lines.md"
        >
          <LinesImage />
        </Card>
        <Card
          className="tooltip"
          title="How tooltips work"
          link="https://github.com/ph1p/figma-measure/blob/master/docs/tooltips.md"
        >
          <TooltipsImage />
        </Card>
        <Card
          className="padding"
          title="How padding works"
          link="https://github.com/ph1p/figma-measure/blob/master/docs/padding.md"
        >
          <PaddingImage />
        </Card>
        <Card
          className="spacing"
          title="How spacing works"
          link="https://github.com/ph1p/figma-measure/blob/master/docs/spacing.md"
        >
          <SpacingImage />
        </Card>
        <Card
          className="fill"
          title="How fills work"
          link="https://github.com/ph1p/figma-measure/blob/master/docs/fills.md"
        >
          <FillsImage />
        </Card>
        <Card
          className="detach"
          title="How detachment works"
          link="https://github.com/ph1p/figma-measure/blob/master/docs/detachment.md"
        >
          <DetachmentImage />
        </Card>
      </Cards>
    </Container>
  );
});

const Card = (props) => {
  const openLink = () => {
    window.open(props.link, '_blank');
  };

  return (
    <CardWrapper className={props.className} onClick={openLink}>
      <div>{props.children}</div>
      <footer>
        <h5>{props.title}</h5>
        <a href="#">Github {'->'}</a>
      </footer>
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  width: 100%;
  height: 230px;
  border-radius: 8px;
  background-color: #c4c4c4;
  display: grid;
  grid-template-rows: 1fr 55px;
  overflow: hidden;
  cursor: pointer;

  div {
    align-self: center;
    justify-self: center;
  }
  footer {
    border-top: 1px solid rgb(255 255 255 / 6%);
    padding: 10px 15px;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    h5 {
      margin: 0 0 3px;
      font-size: 13px;
      font-weight: normal;
    }
    a {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }
  }
  &.line {
    background-color: #3d434d;
    footer {
      background-color: rgb(255 255 255 / 6%);
    }
  }
  &.tooltip {
    background-color: #93a8ac;
    footer {
      background-color: #9db2b6;
    }
  }
  &.padding {
    background-color: #e1e4dd;
    footer {
      border-top: 1px solid rgb(255 255 255 / 12%);
      background-color: rgb(0 0 0 / 6%);
      color: #000;
      a {
        color: rgba(0 0 0 / 50%);
      }
    }
  }
  &.spacing {
    background-color: #202229;
    footer {
      background-color: rgb(255 255 255 / 6%);

      a {
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
  &.detach {
    background-color: #ffc9c9;
    footer {
      border-top: 1px solid rgb(0 0 0 / 6%);
      background-color: rgb(0 0 0 / 6%);
      color: #000;
      a {
        color: rgba(0 0 0 / 50%);
      }
    }
  }
  &.fill {
    background-color: #d6d6d6;
    footer {
      border-top: 1px solid rgb(0 0 0 / 6%);
      background-color: rgb(0 0 0 / 6%);
      color: #000;
      a {
        color: rgba(0 0 0 / 50%);
      }
    }
  }
`;

const Users = styled.div`
  margin-top: 15px;
  display: flex;
  margin-bottom: 7px;
  a:first-child {
    margin-right: 11px;
  }
`;

const User = styled.a`
  display: flex;
  align-items: center;
  color: #000;
  background-color: #f1f1f1;
  border-radius: 51px;
  padding: 5px 12px 5px 6px;
  img {
    width: 24px;
    height: 24px;
    border-radius: 100%;
  }
  span {
    margin-left: 8px;
  }
`;

const Container = styled.div`
  overflow: auto;
  height: 520px;
  h3 {
    font-size: 13px;
    font-weight: 500;
    margin: 0;
  }
  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const GuidesHeadline = styled.div`
  padding: 16px 15px 9px;
  a {
    display: block;
    margin-top: 2px;
    color: #808080;
    font-size: 11px;
  }
`;

const Paragraph = styled.div`
  padding: 15px;
  p {
    margin: 10px 0 0;
    color: #a0a0a0;
    font-size: 11px;
    line-height: 16px;
  }
`;

const Cards = styled.div`
  padding: 7px 0 7px 7px;
  display: grid;
  grid-gap: 7px;
`;

export default Home;
