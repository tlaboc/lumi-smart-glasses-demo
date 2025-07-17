import React from 'react'

export default function Report() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-black">
      <h1 className="text-2xl font-bold mb-6 text-black">루미(LUMI) 스마트글래스 UI/UX 보고서</h1>
      <section className="mb-8 text-black">
        <h2 className="text-xl font-semibold mb-2 text-black">1. 개요</h2>
        <p className="text-black">디스플레이 없는 시각 보조 스마트글래스의 UI/UX 설계 전략을 제시합니다. 오디오·촉각 중심의 비시각적 인터페이스로 시각장애인/저시력자 지원을 목표로 합니다.</p>
      </section>
      <section className="mb-8 text-black">
        <h2 className="text-xl font-semibold mb-2 text-black">2. 비시각적 인터페이스 설계 원칙</h2>
        <ul className="list-disc ml-6 text-black">
          <li><b>오디오 중심</b>: 모든 정보·피드백을 음성/소리로 제공</li>
          <li><b>촉각 보완</b>: 주요 상호작용·알림에 진동 등 촉각 피드백 활용</li>
          <li><b>단순성</b>: 직관적이고 학습이 쉬운 인터페이스</li>
          <li><b>맥락 인식</b>: 상황·환경에 맞는 정보 우선 제공</li>
          <li><b>에러 복원력</b>: 잘못된 입력/상황에서 쉽게 복구</li>
        </ul>
      </section>
      <section className="mb-8 text-black">
        <h2 className="text-xl font-semibold mb-2 text-black">3. 입력 인터페이스</h2>
        <h3 className="font-bold mt-4 text-black">음성 명령 시스템</h3>
        <table className="w-full text-sm border mb-4 text-black">
          <thead>
            <tr className="bg-gray-100 text-black">
              <th className="border px-2 py-1">명령 카테고리</th>
              <th className="border px-2 py-1">음성 명령 예시</th>
              <th className="border px-2 py-1">기능</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="border px-2 py-1">시스템 제어</td><td className="border px-2 py-1">헬로 글래스, 전원 끄기</td><td className="border px-2 py-1">장치 종료</td></tr>
            <tr><td className="border px-2 py-1">시스템 제어</td><td className="border px-2 py-1">헬로 글래스, 배터리 상태</td><td className="border px-2 py-1">배터리 잔량 확인</td></tr>
            <tr><td className="border px-2 py-1">모드 전환</td><td className="border px-2 py-1">헬로 글래스, 텍스트 읽기 모드</td><td className="border px-2 py-1">OCR 기능 활성화</td></tr>
            <tr><td className="border px-2 py-1">모드 전환</td><td className="border px-2 py-1">헬로 글래스, 주변 설명 모드</td><td className="border px-2 py-1">환경 설명 기능 활성화</td></tr>
            <tr><td className="border px-2 py-1">정보 요청</td><td className="border px-2 py-1">헬로 글래스, 지금 몇 시야?</td><td className="border px-2 py-1">현재 시간 안내</td></tr>
            <tr><td className="border px-2 py-1">기능 제어</td><td className="border px-2 py-1">헬로 글래스, 다시 읽어줘</td><td className="border px-2 py-1">마지막 정보 반복</td></tr>
          </tbody>
        </table>
        <h3 className="font-bold mt-4 text-black">터치패드 제스처</h3>
        <table className="w-full text-sm border mb-4 text-black">
          <thead>
            <tr className="bg-gray-100 text-black">
              <th className="border px-2 py-1">제스처</th>
              <th className="border px-2 py-1">기능</th>
              <th className="border px-2 py-1">촉각 피드백</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="border px-2 py-1">한 번 탭</td><td className="border px-2 py-1">일시정지/재개</td><td className="border px-2 py-1">짧은 진동 1회</td></tr>
            <tr><td className="border px-2 py-1">두 번 탭</td><td className="border px-2 py-1">주요 기능 실행</td><td className="border px-2 py-1">짧은 진동 2회</td></tr>
            <tr><td className="border px-2 py-1">길게 누르기</td><td className="border px-2 py-1">음성 명령 활성화</td><td className="border px-2 py-1">진동 후 음성 인식 시작음</td></tr>
            <tr><td className="border px-2 py-1">위로 스와이프</td><td className="border px-2 py-1">볼륨 증가</td><td className="border px-2 py-1">짧은 진동 + 볼륨 증가음</td></tr>
            <tr><td className="border px-2 py-1">아래로 스와이프</td><td className="border px-2 py-1">볼륨 감소</td><td className="border px-2 py-1">짧은 진동 + 볼륨 감소음</td></tr>
            <tr><td className="border px-2 py-1">오른쪽 스와이프</td><td className="border px-2 py-1">다음 항목 이동</td><td className="border px-2 py-1">짧은 진동</td></tr>
            <tr><td className="border px-2 py-1">왼쪽 스와이프</td><td className="border px-2 py-1">이전 항목 이동</td><td className="border px-2 py-1">짧은 진동</td></tr>
          </tbody>
        </table>
      </section>
      <section className="mb-8 text-black">
        <h2 className="text-xl font-semibold mb-2 text-black">4. 주요 시나리오별 UX 흐름</h2>
        <h3 className="font-bold mt-4 text-black">OCR(텍스트 읽기) 시나리오</h3>
        <ul className="list-decimal ml-6 mb-2 text-black">
          <li>"텍스트 읽기 모드" 음성 명령 또는 기능 버튼 2회 클릭</li>
          <li>음성 안내 및 성공 진동</li>
          <li>카메라 시야 내 텍스트 자동/수동 읽기</li>
          <li>터치패드 스와이프/탭으로 텍스트 블록 이동·제어</li>
        </ul>
        <div className="mb-4">
          {/* Mermaid 다이어그램 예시 (텍스트로 표기) */}
          <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto text-black">
{`flowchart TD
  A[음성/버튼 입력] --> B[텍스트 읽기 모드 진입]
  B --> C[음성 안내 + 진동]
  C --> D[카메라로 텍스트 감지]
  D --> E{자동/수동 읽기}
  E -->|자동| F[자동 읽기]
  E -->|수동| G[터치패드로 읽기]
  F --> H[피드백 및 제어]
  G --> H
`}
          </pre>
        </div>
        <h3 className="font-bold mt-4 text-black">환경 설명 시나리오</h3>
        <ul className="list-decimal ml-6 mb-2 text-black">
          <li>"주변 설명 모드" 음성 명령 또는 기능 버튼 1회 클릭</li>
          <li>음성 안내 및 진동</li>
          <li>주요 물체/사람/장애물 설명</li>
          <li>상세 정보 요청 시 추가 안내</li>
        </ul>
        <div className="mb-4">
          <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto text-black">
{`flowchart TD
  A[음성/버튼 입력] --> B[주변 설명 모드 진입]
  B --> C[음성 안내 + 진동]
  C --> D[환경 인식 및 설명]
  D --> E{상세 정보 요청?}
  E -->|예| F[상세 설명]
  E -->|아니오| G[기본 설명 유지]
`}
          </pre>
        </div>
        <h3 className="font-bold mt-4 text-black">모서리 감지 시나리오</h3>
        <ul className="list-decimal ml-6 mb-2 text-black">
          <li>"모서리 감지 모드" 음성 명령 또는 기능 버튼 3회 클릭</li>
          <li>음성 안내 및 진동</li>
          <li>모서리 감지 시 방향성 소리/진동 안내</li>
          <li>위험 모서리 추가 경고음</li>
        </ul>
        <div className="mb-4">
          <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto text-black">
{`flowchart TD
  A[음성/버튼 입력] --> B[모서리 감지 모드 진입]
  B --> C[음성 안내 + 진동]
  C --> D[모서리 감지]
  D --> E[방향성 소리/진동 안내]
  E --> F{위험 모서리?}
  F -->|예| G[추가 경고음]
  F -->|아니오| H[일반 안내]
`}
          </pre>
        </div>
      </section>
      <section className="mb-8 text-black">
        <h2 className="text-xl font-semibold mb-2 text-black">5. 결론 및 권장사항</h2>
        <ul className="list-disc ml-6 text-black">
          <li>오디오 중심, 단순/일관, 맥락 인식, 다중 피드백, 개인화</li>
          <li>음성 인식·상황 인식·햅틱 고도화, 사용자 학습, 커뮤니티 기능</li>
          <li>구현 우선순위: 음성 명령/피드백 → OCR → 환경 인식/장애물 감지 → 개인화 → 고급 설명</li>
        </ul>
      </section>
    </div>
  )
} 