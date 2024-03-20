export async function generateTrack(id: number) {
  const count = 5 - id.toString().length;
  let sequence = 'MSBSRU-';

  for (let i = 0; i < count; i++) sequence += '0';
  return (sequence += id.toString());
}
