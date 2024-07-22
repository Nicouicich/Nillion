import React, { useEffect, useState } from 'react';
import GenerateUserKey from './nillion/components/GenerateUserKey';
import CreateClient from './nillion/components/CreateClient';
import * as nillion from '@nillion/client-web';

import { NillionClient, NadaValues } from '@nillion/client-web';
import StoreSecretForm from './nillion/components/StoreSecretForm';
import StoreProgram from './nillion/components/StoreProgramForm';
import ComputeForm from './nillion/components/ComputeForm';
import ConnectionInfo from './nillion/components/ConnectionInfo';

export default function Main() {
  const programName = 'multiplication';
  const outputName = 'my_output';
  const partyName1 = 'Party1';
  const partyName2 = 'Party2';

  const [userKey1, setUserKey1] = useState<string | null>(null);
  const [userKey2, setUserKey2] = useState<string | null>(null);

  const [client1, setClient1] = useState<NillionClient | null>(null);
  const [client2, setClient2] = useState<NillionClient | null>(null);

  const [userId1, setUserId1] = useState<string | null>(null);
  const [userId2, setUserId2] = useState<string | null>(null);

  const [partyId1, setPartyId1] = useState<string | null>(null);
  const [partyId2, setPartyId2] = useState<string | null>(null);

  const [storeId_my_int1, setStoreId_my_int1] = useState<string | null>(null);
  const [storeId_my_int2, setStoreId_my_int2] = useState<string | null>(null);

  const [programId, setProgramId] = useState<string | null>(null);
  const [additionalComputeValues, setAdditionalComputeValues] = useState<NadaValues | null>(null);
  const [computeResult, setComputeResult] = useState<any>(null);

  useEffect(() => {
    console.log(client1);
    if (userKey1 && client1) {
      setUserId1(client1.user_id);
      setPartyId1(client1.party_id);
    }
  }, [userKey1, client1]);

  useEffect(() => {
    console.log(client2);
    if (userKey2 && client2) {
      setUserId2(client2.user_id);
      setPartyId2(client2.party_id);
    }
  }, [userKey2, client2]);

  useEffect(() => {
    if (client1) {
      const additionalComputeValues = new nillion.NadaValues();
      setAdditionalComputeValues(additionalComputeValues);
    }
  }, [client1]);

  useEffect(() => {
    console.log('Party ID 1:', partyId1);
    console.log('Party ID 2:', partyId2);
    console.log('Program ID:', programId);
    console.log('Store ID my_int1:', storeId_my_int1);
    console.log('Store ID my_int2:', storeId_my_int2);
  }, [partyId1, partyId2, programId, storeId_my_int1, storeId_my_int2]);

  return (
    <div>
      <h1>Blind Computation Demo</h1>
      <p>
        Connect to Nillion with a user key, then follow the steps to store a program,
        store secrets, and compute on the secrets.
      </p>
      <ConnectionInfo client={client1} userkey={userKey1} />
      <ConnectionInfo client={client2} userkey={userKey2} />

      <h1>1. Connect to Nillion Clients {client1 && ' ✅'} {client2 && ' ✅'} </h1>
      <GenerateUserKey setUserKey={setUserKey1} />
      <GenerateUserKey setUserKey={setUserKey2} />

      {userKey1 && <CreateClient userKey={userKey1} setClient={setClient1} />}
      {userKey2 && <CreateClient userKey={userKey2} setClient={setClient2} />}
      <br />

      <h1>2. Store Program {programId && ' ✅'}</h1>
      {client1 && (
        <>
          <StoreProgram
            nillionClient={client1}
            defaultProgram={programName}
            onNewStoredProgram={(program) => setProgramId(program.program_id)}
          />
        </>
      )}
      <br />

      <h1>3. Store Secrets {storeId_my_int1 && storeId_my_int2 && ' ✅'}</h1>
      {userId1 && userId2 && programId && (
        <>
          <h2>Store my_int1 {storeId_my_int1 && ' ✅'}</h2>
          <StoreSecretForm
            secretName={'my_int1'}
            onNewStoredSecret={(secret) => setStoreId_my_int1(secret.storeId)}
            nillionClient={client1}
            secretType="SecretInteger"
            isLoading={false}
            itemName=""
            hidePermissions
            defaultUserWithComputePermissions={userId1}
            defaultProgramIdForComputePermissions={programId}
          />

          <h2>Store my_int2 {storeId_my_int2 && ' ✅'}</h2>
          <StoreSecretForm
            secretName={'my_int2'}
            onNewStoredSecret={(secret) => setStoreId_my_int2(secret.storeId)}
            nillionClient={client2}
            secretType="SecretInteger"
            isLoading={false}
            itemName=""
            hidePermissions
            defaultUserWithComputePermissions={userId2}
            defaultProgramIdForComputePermissions={programId}
          />

        </>
      )}
      <br />

      <h1>4. Compute {computeResult && ' ✅'}</h1>
      {client1 &&
        programId &&
        storeId_my_int1 &&
        storeId_my_int2 &&
        partyId1 &&
        partyId2 &&
        additionalComputeValues && (
          <ComputeForm
            nillionClient={client1}
            programId={programId}
            additionalComputeValues={additionalComputeValues}
            storeIds={[storeId_my_int1, storeId_my_int2]}
            inputParties={[
              { partyName: partyName1, partyId: partyId1 },
              { partyName: partyName2, partyId: partyId2 },
            ]}
            outputParties={[{ partyName: partyName1, partyId: partyId1 }, { partyName: partyName2, partyId: partyId2 }]}
            outputName={outputName}
            onComputeProgram={(result) => setComputeResult(result.value)
            }
          />
        )}
      <br />
    </div>
  );
}
