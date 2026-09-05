// 各級の問題タイプと語数目安
// 英検公式情報に基づいて設定
const gradeData = {
  grade3: {
    name: '英検3級',
    types: {
      email: {
        name: 'Eメール',
        min: 15,
        max: 25
      },
      essay: {
        name: '英作文',
        min: 25,
        max: 35
      }
    }
  },
  pre2: {
    name: '英検準2級',
    types: {
      email: {
        name: 'Eメール',
        min: 40,
        max: 50
      },
      essay: {
        name: '英作文',
        min: 50,
        max: 60
      }
    }
  },
  pre2plus: {
    name: '英検準2級プラス',
    types: {
      summary: {
        name: '英文要約',
        min: 25,
        max: 35
      },
      essay: {
        name: '英作文',
        min: 50,
        max: 60
      }
    }
  },
  grade2: {
    name: '英検2級',
    types: {
      summary: {
        name: '英文要約',
        min: 45,
        max: 55
      },
      essay: {
        name: '英作文',
        min: 80,
        max: 100
      }
    }
  },
  pre1: {
    name: '英検準1級',
    types: {
      summary: {
        name: '英文要約',
        min: 60,
        max: 70
      },
      essay: {
        name: '英作文',
        min: 120,
        max: 150
      }
    }
  },
  grade1: {
    name: '英検1級',
    types: {
      summary: {
        name: '英文要約',
        min: 90,
        max: 110
      },
      essay: {
        name: '英作文',
        min: 200,
        max: 240
      }
    }
  }
};

const elements = {
  textInput: document.getElementById('textInput'),
  gradeSelect: document.getElementById('gradeSelect'),
  problemTypeSelect: document.getElementById('problemTypeSelect'),
  problemTypeGroup: document.getElementById('problemTypeGroup'),
  wordCount: document.getElementById('wordCount'),
  charCount: document.getElementById('charCount'),
  statusValue: document.getElementById('statusValue'),
  statusCard: document.getElementById('statusCard'),
  clearBtn: document.getElementById('clearBtn'),
  targetSection: document.getElementById('targetSection'),
  targetRange: document.getElementById('targetRange')
};

let currentTarget = null;

// 英単語数をカウント
function countWords(text) {
  text = text.trim();
  if (!text) return 0;

  const words = text.split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

// 文字数をカウント
function countCharacters(text) {
  return text.length;
}

// 級選択時に問題タイプセレクトボックスを更新
function updateProblemTypes() {
  const selectedGrade = elements.gradeSelect.value;

  if (!selectedGrade) {
    elements.problemTypeGroup.style.display = 'none';
    elements.targetSection.style.display = 'none';
    elements.problemTypeSelect.innerHTML = '<option value="">問題タイプを選択</option>';
    resetStatus();
    return;
  }

  const grade = gradeData[selectedGrade];
  const types = grade.types;

  // 問題タイプセレクトボックスを更新
  let optionsHTML = '<option value="">問題タイプを選択</option>';
  for (const [key, type] of Object.entries(types)) {
    optionsHTML += `<option value="${key}">${type.name}</option>`;
  }
  elements.problemTypeSelect.innerHTML = optionsHTML;
  elements.problemTypeSelect.value = '';

  // 問題タイプグループを表示
  elements.problemTypeGroup.style.display = 'block';
  elements.targetSection.style.display = 'none';
  currentTarget = null;
  resetStatus();
}

// 問題タイプ選択時にターゲット語数を表示
function updateTarget() {
  const selectedGrade = elements.gradeSelect.value;
  const selectedType = elements.problemTypeSelect.value;

  if (!selectedGrade || !selectedType) {
    elements.targetSection.style.display = 'none';
    currentTarget = null;
    resetStatus();
    return;
  }

  const grade = gradeData[selectedGrade];
  const type = grade.types[selectedType];

  elements.targetRange.textContent = `${type.min}〜${type.max}語`;
  currentTarget = { min: type.min, max: type.max };

  elements.targetSection.style.display = 'block';
  updateStatus();
}

// ステータス表示を更新
function updateStatusDisplay(wordCount, target) {
  if (wordCount === 0) {
    elements.statusValue.textContent = '---';
    elements.statusCard.classList.remove('under', 'over');
    return;
  }

  if (!target) {
    elements.statusValue.textContent = '---';
    elements.statusCard.classList.remove('under', 'over');
    return;
  }

  if (wordCount < target.min) {
    const shortage = target.min - wordCount;
    elements.statusValue.textContent = `あと${shortage}語`;
    elements.statusCard.classList.add('under');
    elements.statusCard.classList.remove('over');
  } else if (wordCount <= target.max) {
    elements.statusValue.textContent = '目安の範囲内です ✓';
    elements.statusCard.classList.remove('under', 'over');
  } else {
    const excess = wordCount - target.max;
    elements.statusValue.textContent = `${excess}語オーバー`;
    elements.statusCard.classList.add('over');
    elements.statusCard.classList.remove('under');
  }
}

// ステータスをリセット
function resetStatus() {
  elements.statusValue.textContent = '---';
  elements.statusCard.classList.remove('under', 'over');
}

// テキスト入力時のイベント
function updateStatus() {
  const text = elements.textInput.value;
  const wordCount = countWords(text);
  const charCount = countCharacters(text);

  elements.wordCount.textContent = wordCount;
  elements.charCount.textContent = charCount;

  if (currentTarget) {
    updateStatusDisplay(wordCount, currentTarget);
  } else {
    resetStatus();
  }
}

elements.textInput.addEventListener('input', updateStatus);

// 級選択時のイベント
elements.gradeSelect.addEventListener('change', updateProblemTypes);

// 問題タイプ選択時のイベント
elements.problemTypeSelect.addEventListener('change', updateTarget);

// クリアボタンのイベント
elements.clearBtn.addEventListener('click', function() {
  elements.textInput.value = '';
  updateStatus();
  elements.textInput.focus();
});

// 初期化
updateStatus();

window.addEventListener('load', function() {
  elements.textInput.focus();
});
