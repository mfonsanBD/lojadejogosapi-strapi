import React, { useState, useEffect, memo } from 'react';
import styled from 'styled-components';
import { Table } from '@buffetjs/core';
import { Header } from '@buffetjs/custom';
import axios from 'axios';

const Wrapper = styled.div `
  padding: 18px 30px;
  p{
    margin-top: 1rem;
  }
`;

const HomePage = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios
      .get("https://api.github.com/users/mfonsanBD/repos")
      .then((res) => setRows(res.data))
      .catch((e) => strapi.notification.error(`Ops...github API error, ${e}`));
  }, []);

  const headers = [
    {
      name: "Name",
      value: "name",
    },
    {
      name: "Description",
      value: "description",
    },
    {
      name: "Url",
      value: "html_url",
    },
  ];
  return (
    <Wrapper>
      <Header
        title={{ label: 'Repositórios Mike Santos' }}
        content="Minha lista de repositórios públicos no Github."
      />
      <Table
        headers={headers}
        rows={rows}
        onClickRow={(e, data) => window.open(data.html_url, "_blank")}
      />
    </Wrapper>
  );
};

export default memo(HomePage);
