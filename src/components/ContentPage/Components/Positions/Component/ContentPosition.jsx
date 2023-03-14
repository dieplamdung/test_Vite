import React from 'react';
import { Title, WrapperRowContent, WrapperTitle } from '../style';

function ContentPosition({ dataPosition }) {
  return (
    <>
      <WrapperTitle>
        <Title className="instrument">Instrument</Title>
        <Title className="position">Position</Title>
      </WrapperTitle>
      {!!dataPosition?.length &&
        dataPosition.map((position, index) => {
          return (
            <WrapperRowContent
              key={index}
              index={0}
              color={`${position?.position}`.includes('-') ? '#A23D52' : '#096C7B'}>
              <p className="value-instrument">{position?.instrument || ''} </p>
              <p className="value-position">{position?.position || ''}</p>
            </WrapperRowContent>
          );
        })}
    </>
  );
}

export default React.memo(ContentPosition);
