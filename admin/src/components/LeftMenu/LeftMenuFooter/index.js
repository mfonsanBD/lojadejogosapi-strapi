/**
 *
 * LeftMenuFooter
 *
 */

import React from 'react';
import Wrapper, { A } from './Wrapper';

function LeftMenuFooter() {
  return (
    <Wrapper>
      <div className="poweredBy">
        Desenvolvido por:&nbsp;
        <A key="website" href="https://mikedev.com.br" target="_blank" rel="noopener noreferrer">
          Mike Santos
        </A>
      </div>
    </Wrapper>
  );
}

export default LeftMenuFooter;
