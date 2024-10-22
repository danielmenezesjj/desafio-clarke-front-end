import React, { useState } from 'react';
import axios from 'axios';

const EnergyForm = () => {
    const [consumo, setConsumo] = useState('');
    const [fornecedores, setFornecedores] = useState([]);

    const handleInputChange = (e) => {
        setConsumo(e.target.value);
    };

    const handleGraphQLSubmit = async () => {
        if (!consumo) {
            alert('Por favor, digite o consumo mensal de energia (kWh).');
            return;
        }

        const value = parseFloat(consumo);
        const query = `
            query ($consumo: Float!) {
                fornecedores(consumo: $consumo) {
                    nome
                    estado
                    custo_por_kwh
                }
            }
        `;

        try {
            const response = await axios.post('http://3.23.105.134/:8080/graphql', {
                query: query,
                variables: { consumo: value },
            });
            if (!response.data.data.fornecedores || response.data.data.fornecedores.length === 0) {
                alert('Nenhum fornecedor encontrado para este consumo com GraphQL.');
            } else {
                setFornecedores(response.data.data.fornecedores);
            }
        } catch (error) {
            console.error('Erro ao buscar fornecedores com GraphQL:', error);
            if (error.response && error.response.status === 404) {
                alert('Nenhum fornecedor encontrado para este consumo com GraphQL.');
            }
        }
    };

    const handleRestSubmit = async () => {
        if (!consumo) {
            alert('Por favor, digite o consumo mensal de energia (kWh).');
            return;
        }

        const value = parseFloat(consumo);
        try {
            const response = await axios.get(`http://3.23.105.134/:8080/fornecedores/consumo?consumo=${value}`);
            if (!response.data.fornecedores || response.data.fornecedores.length === 0) {
                alert('Nenhum fornecedor encontrado para este consumo com REST.');
            } else {
                setFornecedores(response.data.fornecedores);
            }
        } catch (error) {
            console.error('Erro ao buscar fornecedores com REST:', error);
            if (error.response && error.response.status === 404) {
                alert('Nenhum fornecedor encontrado para este consumo com REST.');
            }
        }
    };

    return (
        <div>
            <h1>Escolha de Fornecedores de Energia</h1>
            <label>
                Consumo Mensal de Energia (kWh):
                <input
                    type="text"
                    value={consumo}
                    onChange={handleInputChange}
                    placeholder="Digite o consumo"
                />
            </label>
            <div>
                <button onClick={handleGraphQLSubmit}>Buscar Fornecedores (GraphQL)</button>
                <button onClick={handleRestSubmit}>Buscar Fornecedores (REST)</button>
            </div>

            <div>
                <h2>Fornecedores Disponíveis</h2>
                <ul>
                    {fornecedores.length > 0 ? (
                        fornecedores.map((fornecedor, index) => (
                            <li key={index}>
                                <strong>{fornecedor.nome}</strong> - {fornecedor.estado} - R${fornecedor.custo_por_kwh}/kWh
                            </li>
                        ))
                    ) : (
                        <p>Nenhum fornecedor encontrado.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default EnergyForm;
