import styled from 'styled-components'

export const Message = styled.div`
  padding: 20px;
  background-color: #4caf50;
  color: white;
`

export const DismissButton = styled.span`
  margin-left: 15px;
  color: white;
  font-weight: bold;
  float: right;
  font-size: 22px;
  line-height: 20px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    color: black;
  }
`
