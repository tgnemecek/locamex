import text0 from './text-0/index';
import text1 from './text-1/index';
import text2 from './text-2/index';
import text3 from './text-3/index';
import text4 from './text-4/index';
import text5 from './text-5/index';
import text6 from './text-6/index';
import text7 from './text-7/index';
import text8 from './text-8/index';

export default function clauses(which, _id, proposal) {
  if (which === 0) {
    return text0(_id);
  } else if (which === 1) {
    return text1(proposal);
  } else if (which === 2) {
    return text2();
  } else if (which === 3) {
    return text3();
  } else if (which === 4) {
    return text4();
  } else if (which === 5) {
    return text5();
  } else if (which === 6) {
    return text6();
  } else if (which === 7) {
    return text7();
  } else if (which === 8) {
    return text8();
  }
}